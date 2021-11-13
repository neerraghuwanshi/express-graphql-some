import * as Yup from 'yup'
import { UserInputError } from 'apollo-server-express'


export const loginValidator = async (args) => {
    const loginSchema = Yup.object().shape({
        email: Yup.string()
            .required('Cannot be Empty')
            .email('E-mail is Invalid'),
        password: Yup.string()
            .required('Cannot be Empty')
            .test(
                'password-space',
                'Cannot include a White Space',
                (value) => !/\s/.test(value),
            )
            .min(8, 'Cannot be Less than 8 Characters')
            .max(20, 'Cannot be Greater than 20 Characters')
            .matches(/[a-z]/, 'Needs a Lower Case Letter')
            .matches(/[A-Z]/, 'Needs an Upper Case Letter')
            .matches(/[0-9]/, 'Needs a Number')
            .matches(/[\W]/, 'Needs a Special Character')
            .matches(/^[\x20-\x7F]+$/, 'Allowed ASCII Characters - HEX(20-7F)'),
    })
    try {
        await loginSchema.validate(args, { abortEarly: true })
    } 
    catch (error) {
        throw new UserInputError(error)
    }
}


export const signUpValidator = async (args) => {
    const signUpSchema = Yup.object().shape({
        email: Yup.string()
            .required('Cannot be Empty')
            .email('E-mail is Invalid'),
        firstName: Yup.string()
            .required('Cannot be Empty')
            .test(
                'firstName-space',
                'Cannot include a White Space',
                (value)=> !/\s/.test(value),
            ).min(2, 'Cannot be Less than 2 Characters')
            .max(20, 'Cannot be Greater than 20 Characters')
            .matches(/^[\x20-\x7F]+$/, 'Allowed ASCII Characters - HEX(20-7F)'),
        lastName: Yup.string()
            .required('Cannot be Empty')
            .test(
                'lastName-space',
                'Cannot include a White Space',
                (value)=> !/\s/.test(value),
            ).min(2, 'Cannot be Less than 2 Characters')
            .max(20, 'Cannot be Greater than 20 Characters')
            .matches(/^[\x20-\x7F]+$/, 'Allowed ASCII Characters - HEX(20-7F)'),
        password: Yup.string()
            .required('Cannot be Empty')
            .test(
                'password-space',
                'Cannot include a White Space',
                (value)=> !/\s/.test(value),
            ).min(8, 'Cannot be Less than 8 Characters')
            .max(20, 'Cannot be Greater than 20 Characters')
            .matches(/[a-z]/, 'Needs a Lower Case Letter')
            .matches(/[A-Z]/, 'Needs an Upper Case Letter')
            .matches(/[0-9]/, 'Needs a Number')
            .matches(/[\W]/, 'Needs a Special Character')
            .matches(/^[\x20-\x7F]+$/, 'Allowed ASCII Characters - HEX(20-7F)'),
    })
    try {
        await signUpSchema.validate(args, { abortEarly: true })
    } 
    catch (error) {
        throw new UserInputError(error)
    }
}


export const verifyEmailValidator = async (args) => {
    const verifyEmailSchema = Yup.object().shape({ 
        otp: Yup.string()
            .required('Cannot be Empty')
            .min(6, 'Should be exactly 6 digits')
            .max(6, 'Should be exactly 6 digits')
            .matches(/^[0-9]+$/, 'Should be only digits')
            .test(
                'shouldNotStartWithZero',
                'Should be between 100000 to 999999',
                val => {
                    if (val && val.length > 0) {
                        return val.slice(0, 1) !== '0'
                    }
                    return true
                }
            ),
    })
    try {
        await verifyEmailSchema.validate(args, { abortEarly: true })
    } 
    catch (error) {
        throw new UserInputError(error)
    }
}


export const searchEmailsValidator = async (args) => {
    const searchEmailsSchema = Yup.object().shape({
        email: Yup.string()
            .required('Cannot be Empty'),
    })
    try {
        await searchEmailsSchema.validate(args, { abortEarly: true })
    } 
    catch (error) {
        throw new UserInputError(error)
    }
}