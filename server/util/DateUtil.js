function oneMonth() {
  const dates = []
  let month = new Date()
  month = month.setMonth(month.getMonth() - 1)
  month = new Date(month).toLocaleDateString()
  month = new Date(month)
  dates.push(month)
  let now = new Date().toLocaleDateString()
  now = new Date(now)
  dates.push(now)
  return dates
}

function format(date) {
  let createdTime = new Date(date).toLocaleDateString()
  createdTime = new Date(createdTime)
  return createdTime
}

exports.dateFilter = (tmpList,state=0) => {
  let dates = oneMonth()
  if(state)
    tmpList = tmpList.filter((v) => v.state === state)
  tmpList = tmpList.filter((v) => {
    const createdTime = format(v.created_at)
    return (
      createdTime.getTime() >= dates[0].getTime() &&
      createdTime.getTime() <= dates[1].getTime()
    )
  })
  return tmpList
}
