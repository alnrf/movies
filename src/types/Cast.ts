export interface CastMember {
  id: number;
  name: string;
  character?: string;
  profile_path: string | null;
  roles?: { character: string }[];
}
