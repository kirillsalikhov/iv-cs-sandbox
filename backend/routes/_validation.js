const Joi = require("joi");

const convertRequestSchema = Joi.object().keys({
    fileKey: Joi.string()
        .required()
        .uuid(),

    fileName: Joi.string()
        .required()
        .custom((value, helpers)=> {
            if(!value.toLowerCase().endsWith('.ifc')) {
                return helpers.message({custom: "File extension should be .ifc"});
            }
            return true;
        }),

    conversionType: Joi.string()
        .required()
        .valid('ifc2wmd', 'ifc2wmdOpt')
});

exports.validateConvert = (params) =>  Joi.assert(params, convertRequestSchema);
