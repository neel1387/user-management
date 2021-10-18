const Enum = require('enum');

const model = {
  status: {
    emailStatus: new Enum(['unverified', 'verified']),
  },
  content: {
    contentType: new Enum(['video', 'audio', 'ebook']),
  },
  user: {
    gender: new Enum(['Male', 'Female', 'Non-Binary', 'Transgender', 'Prefer Not To Answer']),
    socialPlatform: new Enum(['google', 'facebook', 'apple']),
    subscriptionStatus: new Enum(['undefined', 'subscribed', 'expired']),
    mentor: {
      costStatus: new Enum(['pending', 'approved', 'rejected']),
      sessionTypes: new Enum(['inApp', 'inPerson']),
    },
    costType: new Enum(['inApp', 'inPerson']),
  },
  subscription: {
    type: new Enum(['monthly', 'annually']),
  },
  userSubscription: {
    status: new Enum(['pending', 'success', 'failed']),
    inAppMode: new Enum(['production', 'sandbox']),
  },
  chat: {
    messageType: new Enum(['text', 'audio', 'video', 'image', 'document']),
  },
};

module.exports = model;
