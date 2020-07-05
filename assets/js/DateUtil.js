function oneDay() {
  const dates = []
  let now = new Date().toLocaleDateString()
  now = new Date(now)
  dates.push(now)
  return dates
}

function oneWeek() {
  const dates = []
  let week = new Date()
  week = week.setDate(week.getDate() - 7)
  week = new Date(week).toLocaleDateString()
  week = new Date(week)
  dates.push(week)
  let now = new Date().toLocaleDateString()
  now = new Date(now)
  dates.push(now)
  return dates
}

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

function oneYear() {
  const dates = []
  let year = new Date()
  year = year.setFullYear(year.getFullYear() - 1)
  year = new Date(year).toLocaleDateString()
  year = new Date(year)
  dates.push(year)
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

exports.dateFilter = (timeType, date, tmpList) => {
  let dates = []
  switch (timeType) {
    case 1:
      dates = oneDay()
      break
    case 2:
      dates = oneWeek()
      break
    case 3:
      dates = oneMonth()
      break
    case 4:
      dates = oneYear()
      break
    case 5:
      dates = date
      break
  }
  tmpList = tmpList.filter((v) => {
    const createdTime = format(v.created_at)
    if (dates.length === 1) return createdTime.getTime() === dates[0].getTime()
    else
      return (
        createdTime.getTime() >= dates[0].getTime() &&
        createdTime.getTime() <= dates[1].getTime()
      )
  })
  return tmpList
}
