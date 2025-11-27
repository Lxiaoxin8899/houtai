import { ResourceOptions } from 'adminjs';

const resourceGroup = {
  name: 'User Management',
  icon: 'User',
};

export const userResourceOptions: ResourceOptions = {
  navigation: resourceGroup,
  listProperties: [
    'id',
    'email',
    'firstName',
    'lastName',
    'role',
    'status',
    'createdAt',
  ],
  showProperties: [
    'id',
    'email',
    'provider',
    'firstName',
    'lastName',
    'role',
    'status',
    'photo',
    'createdAt',
    'updatedAt',
  ],
  editProperties: ['email', 'firstName', 'lastName', 'role', 'status', 'photo'],
  filterProperties: [
    'id',
    'email',
    'firstName',
    'lastName',
    'role',
    'status',
    'createdAt',
  ],
  sort: {
    sortBy: 'createdAt',
    direction: 'desc',
  },
  properties: {
    password: {
      isVisible: false,
    },
    deletedAt: {
      isVisible: false,
    },
  },
};

export const sessionResourceOptions: ResourceOptions = {
  navigation: resourceGroup,
  listProperties: ['id', 'user', 'createdAt', 'updatedAt'],
  filterProperties: ['id', 'user', 'createdAt'],
  showProperties: ['id', 'user', 'createdAt', 'updatedAt'],
  properties: {
    hash: {
      isVisible: false,
    },
    deletedAt: {
      isVisible: false,
    },
  },
  actions: {
    new: { isAccessible: false, isVisible: false },
    edit: { isAccessible: false, isVisible: false },
  },
};
