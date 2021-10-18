const responseBuilder = {};

responseBuilder.success = (obj) => {
  const newObj = { 
    status: true,
    message: obj.message || obj.msg,
  };
  return newObj;
};

responseBuilder.successWithData = (obj) => {
  const _obj = obj;
  const message = obj.message || obj.msg || null;
  delete _obj.message;
  delete _obj.msg;
  const newObj = { 
    status: true,
    message,
    data: obj,
  };
  
  return newObj;
};

module.exports = responseBuilder;
