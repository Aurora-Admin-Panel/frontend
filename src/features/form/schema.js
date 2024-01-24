const schema = {
  firstName: {
    label: 'First Name',
    type: 'text',
    defaultValue: 'John',
    validation: {
      required: 'First Name is required',
      minLength: {
        value: 3,
        message: 'First Name should have at least 3 characters',
      },
    },
  },
  lastName: {
    label: 'Last Name',
    type: 'text',
    validation: {
      required: 'Last Name is required',
    },
  },
  email: {
    label: 'Email',
    type: 'email',
    validation: {
      required: 'Email is required',
      pattern: {
        value: /^\S+@\S+$/i,
        message: 'Invalid email address',
      },
    },
  },
  isOK: {
    label: 'I agree to the terms and conditions',
    type: 'checkbox',
    validation: {
      required: 'You must agree to the terms and conditions',
    },
  },
  options: {
    label: 'Options',
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    type: 'select',
    validation: {
      required: 'Options is required',
    }
  },
  friends: {
    label: 'Friends',
    type: 'list',
    values: {
      label: 'Friend',
      type: 'text',
      defaultValue: 'OK',
      validation: {
        required: 'Friend name is required',
      },
    },
  },
  house: {
    label: "House",
    type: "object",
    of: {
      friends: {
        label: 'Friends',
        type: 'list',
        values: {
          label: 'Friend',
          type: 'text',
          defaultValue: 'OK',
          validation: {
            required: 'Friend name is required',
          },
        },
      },
      lastName: {
        label: 'Last Name',
        type: 'text',
        validation: {
          required: 'Last Name is required',
        },
      },
      isOK: {
        label: 'I agree to the terms and conditions',
        type: 'checkbox',
        validation: {
          required: 'You must agree to the terms and conditions',
        },
      }
    }
  }
};
export default schema;