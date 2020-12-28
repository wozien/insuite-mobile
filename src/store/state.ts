import { DataPoint, DataPointId, localData } from '@/assets/js/class'
import { uuid } from '@/assets/js/utils/tools'
interface Company {
  dbName: string;
  name: string;
}

export interface Org {
  id: number;
  name: string;
}

export interface User {
  avatar: string;
  nickname: string;
  phone: string;
  company: Company;
}

// define your typings for the store state
export interface State {
  user: User
  orgs: Org[]
  curOrg?: Org
  localData: {
    [key: string]: DataPoint
  },
  curRecordId: DataPointId
  recordToken: string
}

const state: State = {
  user: {
    avatar: '',
    nickname: '',
    phone: '',
    company: {
      dbName: '',
      name: ''
    }
  },
  orgs: [],
  localData: localData,
  curRecordId: '',
  recordToken: uuid(12)
}

export default state