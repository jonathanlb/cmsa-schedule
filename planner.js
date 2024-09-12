function populatePlanner(divId, schedule) {
  const elt = $(divId)
  elt.empty()
  let column = 0

  let workingDT = ''
  schedule.forEach(event => {
    if (workingDT !== event.dateTime) {
      workingDT = event.dateTime
      addDateTimeRow(elt, workingDT)
      column = 0
    }
    addEvent(elt, event)
    column++
  });
}

const eventCode2Desc = {
  P: 'Playing', 
  'L/D': 'lecture/demonstration',
  H: 'handouts (digital ONLY)',
  AI: 'all instruments (MF, guitar, bass)',
  MF: 'mandolin family', 
  M: 'mandolin', 
  MDL: 'mandola in C (tuned CGDA)',
  OM: 'mandola in G (octave mandolin)', 
  MC: 'mandocello', 
  LC: 'liuto cantabile', 
  G: 'guitar', 
  BOW: 'bowed instruments (e.g. violin, cello)', 
  BEG: 'beginner', 
  INT: 'intermediate', 
  ADV: 'advanced', 
  AL: 'all levels',
}

function addCodes(codes) {
  let div = '<div class="event-codes">'
  if (codes && codes.length > 0) {
    codes.forEach(i => {
      div += `<span><span class="event-code">${i}</span><span class="event-code-description">${eventCode2Desc[i]}</span></span>, `
    })
    div = div.slice(0, -2) // trailing ', '
  }
  div += '</div>'
  return div
}

function addDateTimeRow(elt, dateTime) {
  elt.append(`<div class="program-datetime-row">${dateTime}</div>`)
}

function addEvent(elt, event) {
  const rowClass = dateTimeToClass(event.dateTime)
  let eventDiv = `<div class='program-event-entry ${rowClass}'>`
  eventDiv += `<div class="event-title">${event.title}</div>`
  eventDiv += `<div class="event-presenter">${event.presenter}</div>`
  eventDiv += `<div class="event-location">${event.location}</div>`
  eventDiv += '</div>'
  eventDiv = $(eventDiv)

  if (event.plenary) {
    eventDiv.addClass('expanded-event-description')
  }

  elt.append(eventDiv)

  let detailsDiv = '<div class="program-event-details">'
  detailsDiv += `<div class="event-description">${event.description}</div>`
  if (event.type) {
    detailsDiv += `<div>${event.type}</div>`
  }
  if (event.codes && event.codes.length > 0) {
    detailsDiv += addCodes(event.codes)
  }
  detailsDiv += '</div>'
  detailsDiv = $(detailsDiv)

  eventDiv.append(detailsDiv)

  // expand entry, hiding the others in the same row (w/ same dateTime)
  const showDetails = () => {
      detailsDiv.show()
      elt.find(`.${rowClass}`).hide()
      eventDiv.show()
      if (!event.plenary) {
        eventDiv.toggleClass('expanded-event-description')
      }
  }
  eventDiv.on('mouseenter', showDetails)

  // restore the row
  const hideDetails = () => {
      detailsDiv.hide()
      if (!event.plenary) {
        eventDiv.toggleClass('expanded-event-description')
      }
      elt.find(`.${rowClass}`).show()
  }
  eventDiv.on('mouseleave', hideDetails)

  // Make selection sticky between visits
  const lsEventKey = 'event-title-' + event.title
  let isSelected = localStorage.getItem(lsEventKey) || false
  function highlightEventEntry() {
    isSelected != isSelected
    localStorage.setItem(lsEventKey, isSelected)
    eventDiv.toggleClass('program-event-selected')
  }
  if (isSelected) {
    highlightEventEntry()
  }
  eventDiv.on('dblclick', highlightEventEntry)
}

function dateTimeToClass(dateTime) {
  return dateTime.replace(/[, \-:\(\)]/g, '_')
}