function logger(req,res,next){
  console.log(new Date(), req.method, req.url);
  res.send('ciao');
  next();
}

module.exports = logger;