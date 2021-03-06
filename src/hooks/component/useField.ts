import { isEmpty } from 'lodash-es'
import { computed, ref, PropType, watchEffect } from 'vue'
import { useStore } from '@/store'
import { Field, Item, ModifierKey } from '@/logics/types'
import { DataPoint, DataPointState, DataPointData } from '@/logics/types/dataPoint'
import fieldUtils from '@/logics/core/fieldUtils'
import { notifyChanges, evalModifiers } from '@/logics/core/dataPoint'

type WidgetMode = 'readonly' | 'edit'
type FieldValue = string | number | boolean | Date
type RawFieldValue = FieldValue | DataPoint

export const fieldCommonProps = {
  item: {
    type: Object as PropType<Item>,
    default: () => {} // required 不能类型推断为必录 ???
  },
  field: {
    type: Object as PropType<Field>,
    default: () => {}
  },
  mode: {
    type: String as PropType<WidgetMode>,
    default: 'readonly'
  },
  isVirtual: Boolean
}

export type FieldCommonPropsType = Readonly<{
  mode: WidgetMode
  item: Item
  field: Field
  isVirtual?: boolean
}>

export default function (props: FieldCommonPropsType) {
  const store = useStore()
  const string = computed(() => {
    return props.isVirtual ? props.field.string : props.item.string
  })
  const type = computed(() => props.field.type)
  const widget = computed(() => props.item.widget)
  const placeholder = computed(() => {
    const text = props.field.isComplexField() ? '选择' : '输入'
    return props.item.placeholder || `请${text}${string.value}`
  })

  const value = ref<FieldValue>('') // format value
  const rawValue = ref<RawFieldValue>('') // parse value
  const modifiers = ref()
  const curRecord = computed<DataPointState>(() => store.getters.curRecord)
  const isReadonly = computed(
    () => (modifiers.value && modifiers.value.readonly) || props.mode === 'readonly'
  )
  const isRequired = computed(() => modifiers.value && modifiers.value.required)
  const invisible = computed(
    () => modifiers.value && (modifiers.value.invisible || modifiers.value.column_invisible)
  )

  /**
   * 字段组件值更新入口
   */
  let lastValue: any
  const setValue = async (val: any) => {
    if (lastValue !== undefined && (lastValue === val || lastValue === val.display_name)) {
      return
    }

    const field = props.field
    let fieldVal = val
    if (field) {
      const fieldType = field.type
      if (!['date', 'datetime'].includes(fieldType)) {
        // value is Date Object same as rawValue
        fieldVal = (fieldUtils.parse as any)[fieldType](val)
      }
      const dataValue = (curRecord.value?.data as any)[field.name]
      if (dataValue === fieldVal || (dataValue === false && val === '')) {
        return
      }

      const res = await notifyChanges(curRecord.value.id, { [field.name]: fieldVal })
      if (res) {
        lastValue = val
        store.commit('SET_RECORD_TOKEN')
      }
    }
    return val
  }

  // handleModel 是为了处理一些不必要的effect
  // 比如，表头进入表体，避免表头字段在destroy前会执行该effect
  // 在表体视图行切换的时候需要重新执行effect
  let handleModel: any
  watchEffect(() => {
    if (props.field && curRecord.value && (!handleModel || handleModel === curRecord.value.model)) {
      if (!handleModel) handleModel = curRecord.value.model
      const data = curRecord.value.data
      const field = props.field as Field
      const item = props.item as Item
      const fieldName = field.name

      if (!data || !(fieldName in data)) {
        rawValue.value = false
      } else {
        rawValue.value = (data as DataPointData)[fieldName]
      }

      if (!props.field.isX2Many() && !props.field.isNumber()) {
        const fieldType = field.options?.relatedType || field.type
        value.value = (fieldUtils.format as any)[fieldType](rawValue.value, field)
      }

      // 计算modifiers
      if (item && field && (!modifiers.value || !isEmpty(modifiers.value))) {
        let evalutedModifiers = {} as any
        ;['readonly', 'required', 'invisible', 'columnInvisible'].forEach((key: string) => {
          if (key in item.modifiers) {
            evalutedModifiers[key] = item.modifiers[key as ModifierKey]
          } else if (key in field.modifiers) {
            evalutedModifiers[key] = field.modifiers[key as ModifierKey]
          }
        })
        if (!isEmpty(evalutedModifiers)) {
          modifiers.value = evalModifiers(curRecord.value.id, evalutedModifiers)
        } else {
          modifiers.value = {}
        }
      }
    }
  })

  return {
    string,
    placeholder,
    type,
    widget,
    value,
    rawValue,
    curRecord,
    modifiers,
    isReadonly,
    isRequired,
    invisible,
    setValue
  }
}
