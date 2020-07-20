const Testimonial = require('../models/testimonial.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Testimonial.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getId = async (req, res) => {
  try {
    const dep = await Testimonial.findById(req.params.id);
    if(!dep) res.status(404).json({ message: 'Not found' });
    else {res.json(dep)};
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.post = async (req, res) => {
  try {
    const { author, text } = req.body;
    const newTestimonial = new Testimonial({ author, text });
    await newTestimonial.save(); //save - add to collection
    res.json({ message: 'OK' });

  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.putId = async (req, res) => {
  const { author, text } = req.body;
  try {
    const dep = await(Testimonial.findById(req.params.id));
    if(dep) {
      await Testimonial.updateOne({ _id: req.params.id }, { $set: { author, text }});
      res.json({ message: `OK, You changed for: ${dep}` });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteId = async (req, res) => {
  try {
    const dep = await(Testimonial.findById(req.params.id));
    if(dep) {
      await Testimonial.deleteOne({ _id: req.params.id });
      res.json({ message: `OK, You delated this document: ${dep}` });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};