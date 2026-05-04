const events = [
  { id: '1', title: 'Weekly Team Sync', eventDate: '2026-04-10T11:00:00.000Z' },
  { id: '2', title: 'Payroll Review', eventDate: '2026-04-12T15:00:00.000Z' }
];

const getEvents = async (_req, res) => res.status(200).json(events);

const createEvent = async (req, res, next) => {
  try {
    const title = String(req.body.title || req.body.name || '').trim();
    const eventDate = req.body.eventDate || req.body.date || req.body.start || req.body.startDate;

    if (!title || !eventDate) {
      return res.status(400).json({ message: 'title and eventDate are required' });
    }

    const parsedDate = new Date(eventDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'eventDate must be a valid date' });
    }

    const newEvent = {
      id: String(Date.now()),
      title,
      eventDate: parsedDate.toISOString()
    };

    if (req.body.description !== undefined) {
      newEvent.description = String(req.body.description).trim();
    }

    if (req.body.type !== undefined) {
      newEvent.type = String(req.body.type).trim();
    }

    events.push(newEvent);
    return res.status(201).json(newEvent);
  } catch (error) {
    return next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = events.find(item => item.id === req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.body.title !== undefined || req.body.name !== undefined) {
      const title = String(req.body.title || req.body.name || '').trim();
      if (!title) {
        return res.status(400).json({ message: 'title must not be empty' });
      }
      event.title = title;
    }

    const nextDate = req.body.eventDate || req.body.date || req.body.start || req.body.startDate;
    if (nextDate !== undefined) {
      const parsedDate = new Date(nextDate);
      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: 'eventDate must be a valid date' });
      }
      event.eventDate = parsedDate.toISOString();
    }

    if (req.body.description !== undefined) {
      event.description = String(req.body.description).trim();
    }

    if (req.body.type !== undefined) {
      event.type = String(req.body.type).trim();
    }

    return res.status(200).json(event);
  } catch (error) {
    return next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const index = events.findIndex(item => item.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const [deletedEvent] = events.splice(index, 1);
    return res.status(200).json({ message: 'Event deleted successfully', event: deletedEvent });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
