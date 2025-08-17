export const BUSCAR_NICKNAME =
  "https://supabase.exbrhabbo.com/rest/v1/enrollments?select=*%2Crole%3Aroles%28id%2Cname%2Ctype%29%2Cinitials%3Ainitials%28id%2Cname%29%2Ccompany%3Acompanies%28id%2Cname%29%2Cstatus%3Astatus%28id%2Cname%29%2Cbranch%3Abranches%28id%2Cname%29%2Cpromoted_by%28*%29%2Clecture%3Alectures%28id%2Cname%29&nickname=ilike.%25";

export const DADOS_MONITORES =
  "https://supabase.exbrhabbo.com/rest/v1/clusters_reports?select=*,member:enrollments!clusters_reports_member_fkey(id,nickname),report_model:cluster_report_models(*),accepted_by:enrollments!clusters_reports_accepted_by_fkey(id,nickname)&order=created_at.desc&accepted=is.true&cluster=eq.e34ee431-8e67-456d-8216-fce1b8a9a60b&member=eq.";

export const API_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyODc0Njc2MCwiZXhwIjo0ODg0NDIwMzYwLCJyb2xlIjoiYW5vbiJ9.PfUXWWBShhau-OE27c8GbPuIP8p3afvItzxi0Xpel0E";
export const AUTH_TOKEN =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyODc0Njc2MCwiZXhwIjo0ODg0NDIwMzYwLCJyb2xlIjoiYW5vbiJ9.PfUXWWBShhau-OE27c8GbPuIP8p3afvItzxi0Xpel0E";
