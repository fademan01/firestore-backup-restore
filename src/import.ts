import * as fs from 'fs'
import { v1 as uuidv1 } from 'uuid'
import * as admin from 'firebase-admin'
import latinize from 'latinize'
import {
  makeTime,
  traverseObjects,
  IImportOptions,
  parseAndConvertDates,
  makeGeoPoint,
} from './helper'

/**
 * Restore data to firestore
 *
 * @param {string} fileName
 * @param {IImportOptions} options
 */
export const restore = (
  fileName: string,
  options: IImportOptions
): Promise<any> => {
  const db = admin.firestore()

  return new Promise((resolve, reject) => {
    if (typeof fileName === 'object') {
      let dataObj = fileName

      updateCollection(db, dataObj, options)
        .then(() => {
          resolve({
            status: true,
            message: 'Collection successfully imported!',
          })
        })
        .catch((error) => {
          reject({ status: false, message: error.message })
        })
    } else {
      fs.readFile(fileName, 'utf8', function (err, data) {
        if (err) {
          console.log(err)
          reject({ status: false, message: err.message })
        }

        // Turn string from file to an Array
        let dataObj = JSON.parse(data)

        updateCollection(db, dataObj, options)
          .then(() => {
            resolve({
              status: true,
              message: 'Collection successfully imported!',
            })
          })
          .catch((error) => {
            reject({ status: false, message: error.message })
          })
      })
    }
  }).catch((error) => console.error(error))
}

/**
 * Update data to firestore
 *
 * @param {any} db
 * @param {object} dataObj
 * @param {IImportOptions} options
 */
const updateCollection = async (
  db,
  dataObj: object,
  options: IImportOptions = {}
) => {
  const subCollectionNameList= ['provinces','districts','wards','streets','projects']
  for (var index in dataObj) {
    var collectionName = index
    for (var doc in dataObj[index]) {
      if (dataObj[index].hasOwnProperty(doc)) {
        // asign document id for array type
        let specificsubcollection = index.split("/");
        let docId = Array.isArray(dataObj[index]) && subCollectionNameList.includes(specificsubcollection[specificsubcollection.length-1]) ? convertToPascalCase(dataObj[index][doc].name) : doc
       console.log('Array.isArray(dataObj[index]) :', Array.isArray(dataObj[index]))
        if (!Array.isArray(dataObj[index])) {
          let  result= subCollectionNameList.filter(word => dataObj[index][word]);
   
          const subCollectionsExist= await result.map(x=> {
          const subCol = dataObj[index][x];
          delete dataObj[index][x]
          return subCol
          })
          await startUpdating(
            db,
            collectionName,
            docId,
            dataObj[index][doc],
            options
          )

          if (subCollectionsExist.length>0){
            for (const [index,subCollections] of subCollectionsExist.entries()) {
              const revivedSubCollection = {}
              const subCollectionPath = `${collectionName}/${docId}/${result[index]}`
              if (result[index]!="projects"){
                revivedSubCollection[subCollectionPath] = subCollections
              console.log('sub:', subCollectionsExist,result[index], "before1:",revivedSubCollection, subCollectionPath )
              await updateCollection(db, revivedSubCollection, options)
              }
              
            }
          }


        } else {
   
          let  result= subCollectionNameList.filter(word => dataObj[index][doc][word]);
          console.log("12", result)
         const subCollectionsExist=  result.map(x=> {
          const subCol = dataObj[index][doc][x];
           delete dataObj[index][doc][x]
          return subCol
          })
          await startUpdating(
            db,
            collectionName,
            docId,
            dataObj[index][doc],
            options
          )

          if (subCollectionsExist.length>0){
            for (const [index,subCollections] of subCollectionsExist.entries()) {
              const revivedSubCollection = {}
              const subCollectionPath = `${collectionName}/${docId}/${result[index]}`
             
              if (result[index]!="projects"){
                revivedSubCollection[subCollectionPath] = subCollections
                console.log('sub1:', subCollectionsExist,result[index], "before3:",revivedSubCollection, subCollectionPath )
                await updateCollection(db, revivedSubCollection, options)
              }
            }
          }

        }
      }
    }
  }
}

/**
 * Write data to database
 * @param db
 * @param collectionName
 * @param docId
 * @param data
 * @param options
 */

const startUpdating = (
  db,
  collectionName: string,
  docId: string,
  data: object,
  options: IImportOptions
) => {
  // Update date value
  if (options.dates && options.dates.length > 0) {
    options.dates.forEach((date) => {
      if (data.hasOwnProperty(date)) {
        // check type of the date
        if (Array.isArray(data[date])) {
          data[date] = data[date].map((d) => makeTime(d))
        } else {
          data[date] = makeTime(data[date])
        }
      }

      // Check for nested date
      if (date.indexOf('.') > -1) {
        traverseObjects(data, (value) => {
          if (!value.hasOwnProperty('_seconds')) {
            return null
          }
          return makeTime(value)
        })
      }
    })
  }

  if (options.autoParseDates) {
    parseAndConvertDates(data)
  }

  // reference key
  if (options.refs && options.refs.length > 0) {
    options.refs.forEach((ref) => {
      if (data.hasOwnProperty(ref)) {
        // check type of the reference
        if (Array.isArray(data[ref])) {
          data[ref] = data[ref].map((ref) => db.doc(ref))
        } else {
          data[ref] = db.doc(data[ref])
        }
      }
    })
  }

  // Enter geo value
  if (options.geos && options.geos.length > 0) {
    options.geos.forEach((geo) => {
      if (data.hasOwnProperty(geo)) {
        // array of geo locations
        if (Array.isArray(data[geo])) {
          data[geo] = data[geo].map((geoValues) => makeGeoPoint(geoValues))
        } else {
          data[geo] = makeGeoPoint(data[geo])
        }
      }

      if (geo.indexOf('.') > -1) {
        traverseObjects(data, (value) => {
          if (!value.hasOwnProperty('_latitude')) {
            return null
          }
          return makeGeoPoint(value)
        })
      }
    })
  }

  return new Promise((resolve, reject) => {
    db.collection(collectionName)
      .doc(docId)
      .set(data)
      .then(() => {
        console.log(`${docId} was successfully added to firestore!`)
        resolve({
          status: true,
          message: `${docId} was successfully added to firestore!`,
        })
      })
      .catch((error) => {
        console.log(error)
        reject({
          status: false,
          message: error.message,
        })
      })
  })
}

/**
 * Convert name to Pascal Case
 * @param txt
 */
const convertToPascalCase = (txt: string) =>{
  return latinize(txt)
      .toLowerCase()
      .replace(/[^\w ]+/g,'')
      .replace(/ +/g,'')
      ;
}