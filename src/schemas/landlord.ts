import { z } from "zod";

export const landlordParamSchema = z.object({
  firstName: z.string().nonempty({ message: "Cannot be blank" }),
  phone: z.string().length(11, "Provide a valid phone number"),
  address: z.string().nonempty({ message: "Cannot be blank" }),
  propertyType: z.number().gt(0, "Pick a property type"),
  leasePrice: z.number().gt(0, "Cannot be zero"),
  leasePeriod: z.number().gt(0, "Cannot be zero"),
  startDate: z.string().nonempty({ message: "Provide a start date" }),
  endDate: z.string().nonempty({ message: "Provide an end date" }),
});

export type LandlordParam = z.infer<typeof landlordParamSchema>;

export const propertyInfoSchema = z.object({
  propertyInfoID: z.number(),
  address: z.string(),
  propertyType: z.number(),
  leasePrice: z.number(),
  leasePeriod: z.number(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  additionalInfo: z
    .object({
      flatNo: z.number().optional(),
    })
    .optional(),
});

export type PropertyInfo = z.infer<typeof propertyInfoSchema>;

export const propertyInfoParam = z.object({
  address: z.string().nonempty({ message: "Provide an address" }),
  propertyType: z.number().gt(0, { message: "Pick a property type" }),
  leasePrice: z.number().gt(0, { message: "Provide a valid lease price" }),
  leasePeriod: z.number().gt(0, { message: "Provide a valid lease period" }),
  startDate: z.string().nonempty({ message: "Provide a start date" }),
});

export type PropertyInfoParam = z.infer<typeof propertyInfoParam>;

export const landlordDetailSchema = z.object({
  landlordID: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  propertyInfo: z.array(propertyInfoSchema),
});

export type LandlordDetail = z.infer<typeof landlordDetailSchema>;

export const landlordSchema = z.object({
  landlordID: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string(),
  address: z.string(),
  propertyType: z.number(),
  leasePrice: z.number(),
  leasePeriod: z.number(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  additionalInfo: z.object({
    flatNo: z.number().optional(),
  }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

export type Landlord = z.infer<typeof landlordSchema>;
