import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { PoseCriteria, PromptHistory, Preset } from "../backend";

export function useGetPromptHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<PromptHistory[]>({
    queryKey: ["promptHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPromptHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPresets() {
  const { actor, isFetching } = useActor();
  return useQuery<Preset[]>({
    queryKey: ["presets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPresets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSituationBehaviors() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["situationBehaviors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSituationBehaviors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendQuery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      criteria,
      combinations,
    }: {
      criteria: PoseCriteria;
      combinations: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.sendQueries(criteria, combinations);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promptHistory"] });
    },
  });
}

export function useSavePreset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, criteria }: { name: string; criteria: PoseCriteria }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.savePreset(name, criteria);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presets"] });
    },
  });
}
