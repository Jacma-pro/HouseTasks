import { config } from 'dotenv';
import { join } from 'path';

export default function setup() {
  config({ path: join(process.cwd(), '.env') });
}
