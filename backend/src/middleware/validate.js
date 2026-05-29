function validate(schema, source = 'body') {
  return (req, res, next) => {
    const data = source === 'query' ? req.query : req.body;
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      const err = new Error(message);
      err.statusCode = 400;
      return next(err);
    }

    if (source === 'query') {
      req.query = value;
    } else {
      req.body = value;
    }

    return next();
  };
}

module.exports = validate;
