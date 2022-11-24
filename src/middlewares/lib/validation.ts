import {
  PhoneNumberUtil,
  PhoneNumberFormat as PNF
} from 'google-libphonenumber'
const phoneUtil = PhoneNumberUtil.getInstance()

export const validatePhoneNumber = (
  number: string,
  country: string
): string => {
  const phoneNumber = phoneUtil.parseAndKeepRawInput(number, country)
  if (!phoneUtil.isValidNumberForRegion(phoneNumber, country))
    throw new Error('Bad phone number')
  return phoneUtil.format(phoneNumber, PNF.E164)
}

import { validate as isEmailValid } from 'email-validator'

export const validateEmail = (email: string): string => {
  if (!isEmailValid(email)) throw new Error('Bad email')
  return email
}

export const validateAddress = (address: string) => {
  const split = address.split(' ')
  const streetNumber = split[split.length - 1]
  if (isNaN(+streetNumber)) throw new Error('Bad address')
  return address
}
