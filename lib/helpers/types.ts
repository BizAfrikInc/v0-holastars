export interface Location {
  id?: string | null;
  name: string;
  address: string;
  phoneNumber?: string | null;
  email?: string | null;
  createdAt?: Date | undefined;
  updatedAt?: Date | null | undefined;
}


export interface Department {
  id?: string | undefined
  locationId?: string;
  name: string;
  description?: string | null;
  createdAt?: Date | undefined
  updatedAt?: Date | null | undefined

}

export interface Business {
  id: string;
  userId: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface UserRolesPermissions {
  id: string,
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  profileImage?: string,
  roles: { roleId: number,roleName: string }[],
  rolePermissions: {
    permissionId: number,
    permissionName: string,
  }[],
  userPermissions: {
    permissionId: number,
    permissionName: string,
  }[],
}
