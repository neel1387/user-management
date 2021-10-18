const utils = {};

utils.validatePaginate = (obj, isForAggregate) => {
  const { page, limit } = obj;
  let actPage = '';
  if (isForAggregate) {
    actPage = (page && !Number.isNaN(Number(page)) && (+page > 0)) ?
      +page : 1;
  } else {
    actPage = (page && !Number.isNaN(Number(page)) && (+page >= 0)) ?
      +page : 0;
  }
  const actLimit = (limit && !Number.isNaN(Number(limit)) && (+limit > 0)) ?
    +limit : 10;
  const queryLimit = actLimit;
  const queryOffset = actLimit * actPage;
  return { limit: queryLimit, offset: queryOffset, page: actPage };
};

module.exports = utils;
