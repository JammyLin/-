class Helper {
  handleAccountValidate(value) {
    return /^(?!\d+$)[\da-zA-Z]{4,15}$/.test(value)
  }

  handlePasswordValidate(value) {
    return /^(?!\d+$)(?![a-zA-Z]+$).{6,16}$/.test(value)
  }

  handleRealNameValidate(value) {
    return /^[\u4E00-\u9FFF]{2,15}$/.test(value)
  }

  handlePhoneValidate(value) {
    return /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)
  }
}

export default ({ app }, inject) => {
  const helper = new Helper()
  inject('helper', helper)
}
