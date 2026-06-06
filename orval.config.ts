import { defineConfig } from "orval";

export default defineConfig({
  todosApi: {
    input: "./Todo App API.json",
    output: {
      mode: "single",
      target: "./src/services/api/generated.ts",
      client: "react-query",
      httpClient: "axios",
      override: {
        mutator: {
          path: "./src/services/api/axiosInstance.ts",
          name: "axiosInstance",
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
