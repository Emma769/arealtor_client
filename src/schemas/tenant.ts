import { z } from "zod";

export const tenantParamSchema = z.object({
  firstName: z.string().nonempty({ message: "Cannot be blank" }),
  gender: z.string().nonempty({ message: "Pick a gender" }),
  dob: z.string().nonempty({ message: "Provide DoB" }),
  phone: z.string().length(11, "Provide a valid phone number"),
  landlordPhone: z.string().length(11, "Provide a valid phone number"),
  address: z.string().nonempty({ message: "Pick an address" }),
  occupation: z.string().nonempty({ message: "Cannot be blank" }),
  nationality: z.string().nonempty({ message: "Cannot be blank" }),
  stateOfOrigin: z.string().nonempty({ message: "Pick a state" }),
  maritalStatus: z.string().nonempty({ message: "Pick a status" }),
  startDate: z.string().nonempty({ message: "Pick a date" }),
  maturityDate: z.string().nonempty({ message: "Pick a date" }),
  renewalDate: z.string().nonempty({ message: "Pick a date" }),
  rentFee: z.number().gt(0, "Provide rent fee"),
});

export type TenantParam = z.infer<typeof tenantParamSchema>;

const rentInfoSchema = z.object({
  rentInfoID: z.number(),
  startDate: z.coerce.date(),
  maturityDate: z.coerce.date(),
  renewalDate: z.coerce.date(),
  landlordID: z.string().uuid(),
  tenantID: z.string().uuid(),
  address: z.string(),
  rentFee: z.number(),
});

export type RentInfo = z.infer<typeof rentInfoSchema>;

export const rentInfoParamSchema = z.object({
  startDate: z.string().nonempty({ message: "Pick a date" }),
  maturityDate: z.string().nonempty({ message: "Pick a date" }),
  renewalDate: z.string().nonempty({ message: "Pick a date" }),
  address: z.string().nonempty({ message: "Pick an address" }),
  rentFee: z.number().gt(0, "Provide rent fee"),
  landlordPhone: z.string().nonempty("Provide a valid phone number"),
});

export type RentInfoParam = z.infer<typeof rentInfoParamSchema>;

export const tenantDetailSchema = z.object({
  tenantID: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string().optional(),
  gender: z.string(),
  dob: z.coerce.date(),
  image: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string(),
  stateOfOrigin: z.string(),
  nationality: z.string(),
  occupation: z.string(),
  additionalInfo: z.object({}),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  rentInfo: z.array(rentInfoSchema),
});

export type TenantDetail = z.infer<typeof tenantDetailSchema>;

export const tenantSchema = z.object({
  tenantID: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string().optional(),
  gender: z.string(),
  dob: z.coerce.date(),
  image: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string(),
  stateOfOrigin: z.string(),
  nationality: z.string(),
  occupation: z.string(),
  additionalInfo: z.object({}),
  rentFee: z.number(),
  startDate: z.coerce.date(),
  maturityDate: z.coerce.date(),
  renewalDate: z.coerce.date(),
  address: z.string(),
  landlordID: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

export type Tenant = z.infer<typeof tenantSchema>;
