/**
 * 列表记录处理
 */

import _ from 'lodash'
import { getApp } from './App'
import { str2Date } from '@/assets/js/utils/date'
import { FieldsInfo } from './Field'
import { fetchNameGet } from '@/api/record'

export interface RecordRaw {
  id: number
  state: string
  create_user: {
    id: number
    name: string
    avatar: string
  }
  create_date: string
  odoo_data: {[key: string]: any}
  [key: string]: any
}

export interface RecordRole {
  id: number
  name: string
}

export interface Creator extends RecordRole {
  avatar: string
  time: Date
}

class Record {
  id: number
  creator: Creator
  state: string
  raw: {[key: string]: any}

  constructor(raw: RecordRaw) {
    this.id = raw.id
    this.state = this.normalizeState(raw.state) || ''
    this.creator = this.normalizeCreator(raw)
    this.raw = raw.odoo_data
  }

  /**
   * 单据创建人处理
   * @param raw 
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  normalizeCreator(raw: RecordRaw): Creator {
    const { id, name, avatar } = raw.create_user
    return {
      id,
      name,
      avatar,
      time: str2Date(raw.create_date)   // 后台返回是UCT时间
    }
  }

  /**
   * 获取单据状态的显示值
   * @param state
   */
  normalizeState(state: string) {
    const curApp = getApp()
    const curModel = curApp.getModel()
    if(curModel) {
      for(let field of curModel.fields) {
        if(field.name === 'state' && field.selection?.length) {
          for(let [key, value] of field.selection) {
            if(key === state) {
              return value;
            }
          }
        }
      }
    }
  }
}

const _getTofetch = (data: any[], fieldsInfo: FieldsInfo) => {
  const res = {} as any
  data.forEach((row: any) => {
    for(let fieldName in row) {
      const field = fieldsInfo[fieldName]
      if(field && field.type === 'reference') {
        const [model, resID] = row[fieldName].split(',')
        if(!res[model]) {
          res[model] = []
        }
        res[model].push(+resID)
      }
    }
  })

  return res
}

/**
 * 批量获取列表的reference字段
 * @param raws 
 * @param fieldsInfo 
 */
export const fetchReferencesBatch = async (raws: RecordRaw[], fieldsInfo?: FieldsInfo) => {
  if(!fieldsInfo) return;
  const toFetchs = _getTofetch(raws.map((raw: RecordRaw) => raw.odoo_data), fieldsInfo)

  const result = {} as any
  await Promise.all(_.map(toFetchs, async (ids: number[], model: string) => {
    const res = await fetchNameGet(model, ids)
    if(res.ret === 0) {
      _.each(res.data, (value: any) => {
        result[`${model},${value[0]}`] = value
      })
    }
  }))

  raws.forEach((raw: RecordRaw) => {
    _.each(raw.odoo_data, (value: any, fieldName: string) => {
      const field = fieldsInfo[fieldName]
      if(field && field.type === 'reference') {
        raw.odoo_data[fieldName] = result[value]
      }
    })
  })
}

export default Record