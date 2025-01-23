import axios from "axios";

export class AuthManager {

  public accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number | null = null;

  constructor(
    private apiKey: string,
    private authURL: string
  ) {}

  async exchangeToken(): Promise<void> {
    const { data } = await axios.post(this.authURL, {
      apiKey: this.apiKey
    });

    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
    this.expiresAt = data.expiresAt;
  }
}