/*
 * @Author      : Mr.bin
 * @Date        : 2023-05-26 10:24:29
 * @LastEditTime: 2023-05-26 10:39:04
 * @Description : Dexie
 */
import Dexie from 'dexie'

export function initDB() {
  const db = new Dexie('Test_Bench') // 与项目名保持一致
  db.version(1).stores({
    // electric为电缸型号
    life_data:
      '++,electric,startTime,endTime,[electric+startTime],[electric+endTime],[startTime+endTime],[electric+startTime+endTime]'
  })
  return db
}
