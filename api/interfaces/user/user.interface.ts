export interface User {
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    username: string;
    password?: string;
    salt?: string;
    profileImageURL: string;
    provider?: string;
    providerData?: any;
    additionalProvidersData?: any;
    roles?: string[];
    updated?: string;
    created?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: string;
}
