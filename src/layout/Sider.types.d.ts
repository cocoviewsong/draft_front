export interface MenuItemClickEvent {
  key: string
  eventKey: string
  keyPath: string[]
  eventKeyPath: string[]
  domEvent: Event
  item: {
    disabled: boolean
    danger: boolean
    title: string
    originItemValue: {
      key: string
      label: string
      title: string
    }
  }
}
