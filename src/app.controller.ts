import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  async getGPT(): Promise<string> {
    const text1 = fs.readFileSync('1.txt', 'utf8');
    const text2 = fs.readFileSync('2.txt', 'utf8');
    const text3 = fs.readFileSync('3.txt', 'utf8');

    return await this.appService.getGPT(text3);
  }
}
