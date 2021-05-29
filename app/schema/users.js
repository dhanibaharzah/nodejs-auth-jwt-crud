module.exports = {
  validateLogin: {
    type: 'object',
    required: [
      'email',
      'password',
    ],
    allOf: [
      {
        properties: {
          email: {
            type: 'string',
            minLength: 6,
            maxLength: 50,
            format: 'email'
          },
          password: {
            type: 'string',
            minLength: 6,
            maxLength: 50
          },
        },
        additionalProperties: false
      }
    ]
  },
  validateRegister: {
    type: 'object',
    required: [
      'email',
      'name',
      'password',
      'confirmpassword'
    ],
    allOf: [
      {
        properties: {
          email: {
            type: 'string',
            minLength: 6,
            maxLength: 50,
            format: 'email'
          },
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 100
          },
          password: {
            type: 'string',
            minLength: 6,
            maxLength: 50
          },
          confirmpassword: {
            type: 'string',
            minLength: 6,
            maxLength: 50
          }
        },
        additionalProperties: false
      }
    ]
  },
  validateRefreshToken: {
    type: 'object',
    required: [
      'refresh_token'
    ],
    allOf: [
      {
        properties: {
          refresh_token: {
            type: 'string',
            minLength: 40,
            maxLength: 75
          }
        },
        additionalProperties: false
      }
    ]
  },
  
  validateProfile: {
    type: 'object',
    required: [
      'name',
      'phone',
      'photo',
    ],
    allOf: [
      {
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 100
          },
          phone: {
            type: 'string',
            minLength: 8,
            maxLength: 20
          },
          photo: {
            type: 'string',
            format: 'uri'
          },
        },
        additionalProperties: false
      }
    ]
  },
  validateEmailForgotPassword: {
    type: 'object',
    required: [
      'email'
    ],
    allOf: [
      {
        properties: {
          email: {
            type: 'string',
            minLength: 6,
            maxLength: 50,
            format: 'email'
          }
        },
        additionalProperties: false
      }
    ]
  },
  validateTokenForgotPassword: {
    type: 'object',
    required: [
      'resetToken'
    ],
    allOf: [
      {
        properties: {
          resetToken: {
            type: 'string',
            minLength: 27,
            maxLength: 50
          }
        },
        additionalProperties: false
      }
    ]
  },
  validateResetPassword: {
    type: 'object',
    required: [
      'resetToken',
      'password',
      'confirmpassword'
    ],
    allOf: [
      {
        properties: {
          resetToken: {
            type: 'string',
            minLength: 27,
            maxLength: 50
          },
          password: {
            type: 'string',
            minLength: 6,
            maxLength: 50
          },
          confirmpassword: {
            type: 'string',
            minLength: 6,
            maxLength: 50
          }
        },
        additionalProperties: false
      }
    ]
  }
}
