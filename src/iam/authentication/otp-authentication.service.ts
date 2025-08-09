import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { User } from "../User";
import { authenticator } from "otplib";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class OtpAuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  generateSecret(email: string): { uri: string; secret: string } {
    const secret = authenticator.generateSecret();
    const appName = this.configService.getOrThrow<string>("TFA_APP_NAME");
    const uri = authenticator.keyuri(email, appName, secret);
    return { uri, secret };
  }

  verifyCode(code: string, secret: string): boolean {
    const secretDecoded = secret;

    return authenticator.verify({ token: code, secret: secretDecoded });
  }

  async enableTFAForUser(email: string, secret: string) {
    const { id } = await this.userRepository.findOneOrFail({
      where: { email },
      select: { id: true },
    });

    const secretEncoded = secret;

    await this.userRepository.update(
      { id },
      { TFASecret: secretEncoded, isTFAEnabled: true },
    );
  }
}
