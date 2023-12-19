import { conf } from '@/conf/config';
import { Account, Client, Functions, ID } from 'appwrite';
import axios from 'axios';

type CreateUserAccount = {
  email: string;
  password: string;
  name: string;
};

type LoginUserAccount = {
  email: string;
  password: string;
};

const appwriteClient = new Client();

appwriteClient.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);

export const account = new Account(appwriteClient);

export const functions = new Functions(appwriteClient);

export class AppwriteService {
  async createUserAccount({ email, password, name }: CreateUserAccount) {
    try {
      const user = await account.create(ID.unique(), email, password, name);
      if (user) {
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async loginUserAccount({ email, password }: LoginUserAccount) {
    try {
      return await account.createEmailSession(email, password);
    } catch (error: any) {
      throw error;
    }
  }

  async isLoggedIn() {
    try {
      const data = await this.getCurrentUser();
      return Boolean(data);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return account.get();
    } catch (error) {
      console.log('getcurrentUser error: ' + error);
    }

    return null;
  }

  async logoutUserAccount() {
    try {
      return await account.deleteSession('current');
    } catch (error) {
      console.log('logout error: ' + error);
    }
  }

  async users() {
    try {
      const usersData = await axios.get(`https://aw.weperbel.com/v1/users`, {
        headers: {
          'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
          'X-Appwrite-Key': `${process.env.NEXT_PUBLIC_APPWRITE_KEY}`,
        },
      });
      return usersData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

const appwriteService = new AppwriteService();

export default appwriteService;
