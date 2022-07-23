import { UserEntity } from './../entites/user.entity';
import { User } from '../models/user.model';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>
	) { }

	async createUser(user: UserEntity): Promise<User> {
		const newUser = new this.userModel(user);
		return newUser.save();
	}

	async findUser(email: string): Promise<User> {
		return this.userModel.findOne({ email }).exec();
	}

	async findUserById(id: string): Promise<User> {
		return this.userModel.findById(id).exec();
	}

	async deleteUser(email: string): Promise<void> {
		this.userModel.deleteOne({ email }).exec();
	}

	async updateUser({ _id, ...rest}: UserEntity) {
		return this.userModel.updateOne({ _id }, { $set: { ...rest }}).exec();
	}

  async healthCheck() {
    return this.userModel.findOne({}).exec();
  }
}
