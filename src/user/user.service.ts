import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client';
import { CreateCommentDto } from './dto/comment.dto';
@Injectable()
export class UserService {
  prisma = new PrismaClient();
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }
  async createUser(email:string,mat_khau:string){
    const hashPass = await bcrypt.hash(mat_khau,10);
    let data = {
      email:email,
      mat_khau:hashPass
    }
    return this.prisma.nguoi_dung.create({data})
  }
  async findByEmail(email:string){
    return this.prisma.nguoi_dung.findFirst({
      where:{
        email
      }
    })
  }
  async verifyPass(mat_khau:string,hashedPass:string){
    return bcrypt.compare(mat_khau,hashedPass)
  }

  async checkEmailExists(email:string){
    const existingUser = await this.prisma.nguoi_dung.findFirst({
      where:{
        email
      }
    })
    if(existingUser)
    {
      return true;
    }
    return false;

  }

  async getImage(id:string){
    return this.prisma.hinh_anh.findUnique({
      where:{
        hinh_id:+id
      },
      include:{
        nguoi_dung:true
      }
    })
  }
  async getCommentsByImageId(imageId:string) {
    return await this.prisma.binh_luan.findMany({
      where:{
        hinh_id:+imageId
      }
    })
  }
  async getSavedInfoByImageId(id:string){

    let data = await this.prisma.luu_anh.findMany({
      where:{
        hinh_id:+id
      },
      include:{
        nguoi_dung:true,
        hinh_anh:true
      }
    })
    if(data.length ===0){
      return { message: 'not found', status: 404};
    }
    return {message:'already save!!' ,status:200,data}
  }
  async createComment(createCommentDto: CreateCommentDto){
    const { nguoi_dung_id, hinh_id, noi_dung } = createCommentDto;

    const existingUser = await this.prisma.nguoi_dung.findUnique({
      where: { nguoi_dung_id },
    });

    if (!existingUser) {
      return {message:"Người dùng không tồn tại" , stauts:404}
    }

    const existingImage = await this.prisma.hinh_anh.findUnique({
      where: { hinh_id },
    });

    if (!existingImage) {
      return {message:"Hình ko tồn tại" , stauts:404}
    }

    return this.prisma.binh_luan.create({
      data: {
        nguoi_dung_id,
        hinh_id,
        ngay_binh_luan: new Date(),
        noi_dung,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
