const app = require('express')();
const cors = require('cors');
// HTTP Logger
const morgan = require('morgan');

// Body Parse
const bodyParser = require('body-parser');

// Translations
const l10n = require('jm-ez-l10n');

l10n.setTranslationsFile('en', './language/translation.en.json');

app.set('port', process.env.PORT);
app.use(l10n.enableL10NExpress);
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ limit: '1gb', extended: true }));
app.use(bodyParser.json());
// Catch JSON error
app.use((error, req, res, next) => {
  if (error) {
    return res.status(400).json({ error: req.t('ERR_GENRIC_SYNTAX'), code: 400 });
  }
  next();
});
app.use(bodyParser.json({ limit: '1gb' }));
app.use(cors());

// Database Init
require('./databse');

app.use('/api', require('../routes'));

module.exports = app;
