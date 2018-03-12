var ua = require('universal-analytics');

/**
 * @param {Request} req
 * @param {Response} res
 * */
module.exports = function trackCalendlyEvent(req, res) {
  const calendarData = req.body;
  let visitor = null;
  if (calendarData.event === 'invitee.created') {
    visitor = ua('UA-80013049-1');
    visitor.event("Consultation", "Appointment").send();
    res.status(200).json(req.body);
  } else {
    res.status(422).send('');
  }
};
