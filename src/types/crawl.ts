export interface CreateCrawlJobRequest {
  keyword: string;      // nhiều dòng
  address?: string;
  limit: number;
  delay: number;
  region?: string;
  deepScan?: boolean;
  deepScanWebsite?: boolean;

}
