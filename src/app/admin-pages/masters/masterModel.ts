// ==== Banner Class ====
export class BannerClass {
    bannerId: number | any;
    bannerImage: string | any;
    imageDescription: string | any;
    startdDate: Date | any;
    endDate: Date | any;
    status: string | any;
}

// ==== Category Class ====
export class CategoryClass {
    categoryId: number | any;
    categoryName: string | any;
    categoryDescription: string | any;
    status: string | any;
}

// ==== User Class ====
export class UserClass {
    userId: number | any;
    userFName: string | any;
    userLName: string | any;
    userMobileNo: string | any;
    userReferenceMobileNo: string | any;
    userStatus: string | any;
}

// ==== Vendor Class ====
export class VendorClass {
    vendorId: number | any;
    vendorFName: string | any;
    vendorLName: string | any;
    vendorMobileNo: string | any;
    vendorBusinessMobileNo: string | any;
    vendorStatus: string | any;

    categoryId: number | any;
    vendorBusinessName: string | any;
    vendorBusinessAddress: string | any;
    vendorBusinessProof: string | any;
    vendorBusinessImage: string | any;
    
    vendorReferenceMobileNo: string | any;
    vendorHoliday: string | any;
    vendorDescription: string | any;

    vendorImagesList: Array<VendorImgList> | any;
    // vendorImagesList: [] | any;
}

export class VendorImgList {
    vendorImageId: number | any;
    vendorImagePath: string | any;
    vendorImageStatus: string | any;
}

// ==== Subscription Class ====
export class SubscriptionClass {
    subscriptionId: number | any;
    subscriptionName: string | any;
    subscriptionDescription: string | any;
    validityInYears: string | any;
    validityInMonths: string | any;
    subscriptionAmount: any | any;
    status: string | any;
}

// ==== Admin Class ====
export class AdminClass{
    adminId: number | any;
    adminMobileNo: string | any;
    adminPassword: string | any;
    adminStatus: string | any;
}

// ==== Job Class ====
export class JobClass{
    jobId: number | any;
    jobName: string | any;
    jobDescription: string | any;
    noOfPositions: string | any;
    jobStatus: string | any;

    vendorId: number | any;
}

