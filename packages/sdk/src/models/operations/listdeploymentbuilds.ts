/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { ClosedEnum } from "../../types/enums.js";

export type ListDeploymentBuildsRequest = {
  /**
   * The deployment unique identifier
   */
  deploymentId: string;
};

/**
 * The state of the deployment depending on the process of deploying, or if it is ready or in an error state
 */
export const ReadyState = {
  Initializing: "INITIALIZING",
  Building: "BUILDING",
  Uploading: "UPLOADING",
  Deploying: "DEPLOYING",
  Ready: "READY",
  Archived: "ARCHIVED",
  Error: "ERROR",
  Queued: "QUEUED",
  Canceled: "CANCELED",
} as const;
/**
 * The state of the deployment depending on the process of deploying, or if it is ready or in an error state
 */
export type ReadyState = ClosedEnum<typeof ReadyState>;

/**
 * An object that contains the Build's configuration
 */
export type Config = {
  distDir?: string | undefined;
  forceBuildIn?: string | undefined;
  reuseWorkPathFrom?: string | undefined;
  zeroConfig?: boolean | undefined;
};

/**
 * The type of the output
 */
export const ListDeploymentBuildsType = {
  Lambda: "lambda",
  File: "file",
  Edge: "edge",
} as const;
/**
 * The type of the output
 */
export type ListDeploymentBuildsType = ClosedEnum<
  typeof ListDeploymentBuildsType
>;

/**
 * If the output is a Serverless Function, an object containing the name, location and memory size of the function
 */
export type Lambda = {
  functionName: string;
  deployedTo: Array<string>;
  memorySize?: number | undefined;
  timeout?: number | undefined;
  layers?: Array<string> | undefined;
};

/**
 * Exists if the output is an edge function.
 */
export type Edge = {
  /**
   * The regions where the edge function will be invoked. Only exists if the edge function as a regional edge function, see: https://vercel.com/docs/concepts/edge-network/regions#setting-edge-function-regions
   */
  regions: Array<string> | null;
};

/**
 * A list of outputs for the Build that can be either Serverless Functions or static files
 */
export type ListDeploymentBuildsOutput = {
  /**
   * The type of the output
   */
  type?: ListDeploymentBuildsType | undefined;
  /**
   * The absolute path of the file or Serverless Function
   */
  path: string;
  /**
   * The SHA1 of the file
   */
  digest: string;
  /**
   * The POSIX file permissions
   */
  mode: number;
  /**
   * The size of the file in bytes
   */
  size?: number | undefined;
  /**
   * If the output is a Serverless Function, an object containing the name, location and memory size of the function
   */
  lambda?: Lambda | null | undefined;
  /**
   * Exists if the output is an edge function.
   */
  edge?: Edge | null | undefined;
};

/**
 * An object representing a Build on Vercel
 */
export type Builds = {
  /**
   * The unique identifier of the Build
   */
  id: string;
  /**
   * The unique identifier of the deployment
   */
  deploymentId: string;
  /**
   * The entrypoint of the deployment
   */
  entrypoint: string;
  /**
   * The state of the deployment depending on the process of deploying, or if it is ready or in an error state
   */
  readyState: ReadyState;
  /**
   * The time at which the Build state was last modified
   */
  readyStateAt?: number | undefined;
  /**
   * The time at which the Build was scheduled to be built
   */
  scheduledAt?: number | null | undefined;
  /**
   * The time at which the Build was created
   */
  createdAt?: number | undefined;
  /**
   * The time at which the Build was deployed
   */
  deployedAt?: number | undefined;
  /**
   * The region where the Build was first created
   */
  createdIn?: string | undefined;
  /**
   * The Runtime the Build used to generate the output
   */
  use?: string | undefined;
  /**
   * An object that contains the Build's configuration
   */
  config?: Config | undefined;
  /**
   * A list of outputs for the Build that can be either Serverless Functions or static files
   */
  output: Array<ListDeploymentBuildsOutput>;
  /**
   * If the Build uses the `@vercel/static` Runtime, it contains a hashed string of all outputs
   */
  fingerprint?: string | null | undefined;
  copiedFrom?: string | undefined;
};

export type ListDeploymentBuildsResponseBody = {
  builds: Array<Builds>;
};

/** @internal */
export const ListDeploymentBuildsRequest$inboundSchema: z.ZodType<
  ListDeploymentBuildsRequest,
  z.ZodTypeDef,
  unknown
> = z.object({
  deploymentId: z.string(),
});

/** @internal */
export type ListDeploymentBuildsRequest$Outbound = {
  deploymentId: string;
};

/** @internal */
export const ListDeploymentBuildsRequest$outboundSchema: z.ZodType<
  ListDeploymentBuildsRequest$Outbound,
  z.ZodTypeDef,
  ListDeploymentBuildsRequest
> = z.object({
  deploymentId: z.string(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ListDeploymentBuildsRequest$ {
  /** @deprecated use `ListDeploymentBuildsRequest$inboundSchema` instead. */
  export const inboundSchema = ListDeploymentBuildsRequest$inboundSchema;
  /** @deprecated use `ListDeploymentBuildsRequest$outboundSchema` instead. */
  export const outboundSchema = ListDeploymentBuildsRequest$outboundSchema;
  /** @deprecated use `ListDeploymentBuildsRequest$Outbound` instead. */
  export type Outbound = ListDeploymentBuildsRequest$Outbound;
}

/** @internal */
export const ReadyState$inboundSchema: z.ZodNativeEnum<typeof ReadyState> = z
  .nativeEnum(ReadyState);

/** @internal */
export const ReadyState$outboundSchema: z.ZodNativeEnum<typeof ReadyState> =
  ReadyState$inboundSchema;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ReadyState$ {
  /** @deprecated use `ReadyState$inboundSchema` instead. */
  export const inboundSchema = ReadyState$inboundSchema;
  /** @deprecated use `ReadyState$outboundSchema` instead. */
  export const outboundSchema = ReadyState$outboundSchema;
}

/** @internal */
export const Config$inboundSchema: z.ZodType<Config, z.ZodTypeDef, unknown> = z
  .object({
    distDir: z.string().optional(),
    forceBuildIn: z.string().optional(),
    reuseWorkPathFrom: z.string().optional(),
    zeroConfig: z.boolean().optional(),
  });

/** @internal */
export type Config$Outbound = {
  distDir?: string | undefined;
  forceBuildIn?: string | undefined;
  reuseWorkPathFrom?: string | undefined;
  zeroConfig?: boolean | undefined;
};

/** @internal */
export const Config$outboundSchema: z.ZodType<
  Config$Outbound,
  z.ZodTypeDef,
  Config
> = z.object({
  distDir: z.string().optional(),
  forceBuildIn: z.string().optional(),
  reuseWorkPathFrom: z.string().optional(),
  zeroConfig: z.boolean().optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Config$ {
  /** @deprecated use `Config$inboundSchema` instead. */
  export const inboundSchema = Config$inboundSchema;
  /** @deprecated use `Config$outboundSchema` instead. */
  export const outboundSchema = Config$outboundSchema;
  /** @deprecated use `Config$Outbound` instead. */
  export type Outbound = Config$Outbound;
}

/** @internal */
export const ListDeploymentBuildsType$inboundSchema: z.ZodNativeEnum<
  typeof ListDeploymentBuildsType
> = z.nativeEnum(ListDeploymentBuildsType);

/** @internal */
export const ListDeploymentBuildsType$outboundSchema: z.ZodNativeEnum<
  typeof ListDeploymentBuildsType
> = ListDeploymentBuildsType$inboundSchema;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ListDeploymentBuildsType$ {
  /** @deprecated use `ListDeploymentBuildsType$inboundSchema` instead. */
  export const inboundSchema = ListDeploymentBuildsType$inboundSchema;
  /** @deprecated use `ListDeploymentBuildsType$outboundSchema` instead. */
  export const outboundSchema = ListDeploymentBuildsType$outboundSchema;
}

/** @internal */
export const Lambda$inboundSchema: z.ZodType<Lambda, z.ZodTypeDef, unknown> = z
  .object({
    functionName: z.string(),
    deployedTo: z.array(z.string()),
    memorySize: z.number().optional(),
    timeout: z.number().optional(),
    layers: z.array(z.string()).optional(),
  });

/** @internal */
export type Lambda$Outbound = {
  functionName: string;
  deployedTo: Array<string>;
  memorySize?: number | undefined;
  timeout?: number | undefined;
  layers?: Array<string> | undefined;
};

/** @internal */
export const Lambda$outboundSchema: z.ZodType<
  Lambda$Outbound,
  z.ZodTypeDef,
  Lambda
> = z.object({
  functionName: z.string(),
  deployedTo: z.array(z.string()),
  memorySize: z.number().optional(),
  timeout: z.number().optional(),
  layers: z.array(z.string()).optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Lambda$ {
  /** @deprecated use `Lambda$inboundSchema` instead. */
  export const inboundSchema = Lambda$inboundSchema;
  /** @deprecated use `Lambda$outboundSchema` instead. */
  export const outboundSchema = Lambda$outboundSchema;
  /** @deprecated use `Lambda$Outbound` instead. */
  export type Outbound = Lambda$Outbound;
}

/** @internal */
export const Edge$inboundSchema: z.ZodType<Edge, z.ZodTypeDef, unknown> = z
  .object({
    regions: z.nullable(z.array(z.string())),
  });

/** @internal */
export type Edge$Outbound = {
  regions: Array<string> | null;
};

/** @internal */
export const Edge$outboundSchema: z.ZodType<Edge$Outbound, z.ZodTypeDef, Edge> =
  z.object({
    regions: z.nullable(z.array(z.string())),
  });

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Edge$ {
  /** @deprecated use `Edge$inboundSchema` instead. */
  export const inboundSchema = Edge$inboundSchema;
  /** @deprecated use `Edge$outboundSchema` instead. */
  export const outboundSchema = Edge$outboundSchema;
  /** @deprecated use `Edge$Outbound` instead. */
  export type Outbound = Edge$Outbound;
}

/** @internal */
export const ListDeploymentBuildsOutput$inboundSchema: z.ZodType<
  ListDeploymentBuildsOutput,
  z.ZodTypeDef,
  unknown
> = z.object({
  type: ListDeploymentBuildsType$inboundSchema.optional(),
  path: z.string(),
  digest: z.string(),
  mode: z.number(),
  size: z.number().optional(),
  lambda: z.nullable(z.lazy(() => Lambda$inboundSchema)).optional(),
  edge: z.nullable(z.lazy(() => Edge$inboundSchema)).optional(),
});

/** @internal */
export type ListDeploymentBuildsOutput$Outbound = {
  type?: string | undefined;
  path: string;
  digest: string;
  mode: number;
  size?: number | undefined;
  lambda?: Lambda$Outbound | null | undefined;
  edge?: Edge$Outbound | null | undefined;
};

/** @internal */
export const ListDeploymentBuildsOutput$outboundSchema: z.ZodType<
  ListDeploymentBuildsOutput$Outbound,
  z.ZodTypeDef,
  ListDeploymentBuildsOutput
> = z.object({
  type: ListDeploymentBuildsType$outboundSchema.optional(),
  path: z.string(),
  digest: z.string(),
  mode: z.number(),
  size: z.number().optional(),
  lambda: z.nullable(z.lazy(() => Lambda$outboundSchema)).optional(),
  edge: z.nullable(z.lazy(() => Edge$outboundSchema)).optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ListDeploymentBuildsOutput$ {
  /** @deprecated use `ListDeploymentBuildsOutput$inboundSchema` instead. */
  export const inboundSchema = ListDeploymentBuildsOutput$inboundSchema;
  /** @deprecated use `ListDeploymentBuildsOutput$outboundSchema` instead. */
  export const outboundSchema = ListDeploymentBuildsOutput$outboundSchema;
  /** @deprecated use `ListDeploymentBuildsOutput$Outbound` instead. */
  export type Outbound = ListDeploymentBuildsOutput$Outbound;
}

/** @internal */
export const Builds$inboundSchema: z.ZodType<Builds, z.ZodTypeDef, unknown> = z
  .object({
    id: z.string(),
    deploymentId: z.string(),
    entrypoint: z.string(),
    readyState: ReadyState$inboundSchema,
    readyStateAt: z.number().optional(),
    scheduledAt: z.nullable(z.number()).optional(),
    createdAt: z.number().optional(),
    deployedAt: z.number().optional(),
    createdIn: z.string().optional(),
    use: z.string().optional(),
    config: z.lazy(() => Config$inboundSchema).optional(),
    output: z.array(z.lazy(() => ListDeploymentBuildsOutput$inboundSchema)),
    fingerprint: z.nullable(z.string()).optional(),
    copiedFrom: z.string().optional(),
  });

/** @internal */
export type Builds$Outbound = {
  id: string;
  deploymentId: string;
  entrypoint: string;
  readyState: string;
  readyStateAt?: number | undefined;
  scheduledAt?: number | null | undefined;
  createdAt?: number | undefined;
  deployedAt?: number | undefined;
  createdIn?: string | undefined;
  use?: string | undefined;
  config?: Config$Outbound | undefined;
  output: Array<ListDeploymentBuildsOutput$Outbound>;
  fingerprint?: string | null | undefined;
  copiedFrom?: string | undefined;
};

/** @internal */
export const Builds$outboundSchema: z.ZodType<
  Builds$Outbound,
  z.ZodTypeDef,
  Builds
> = z.object({
  id: z.string(),
  deploymentId: z.string(),
  entrypoint: z.string(),
  readyState: ReadyState$outboundSchema,
  readyStateAt: z.number().optional(),
  scheduledAt: z.nullable(z.number()).optional(),
  createdAt: z.number().optional(),
  deployedAt: z.number().optional(),
  createdIn: z.string().optional(),
  use: z.string().optional(),
  config: z.lazy(() => Config$outboundSchema).optional(),
  output: z.array(z.lazy(() => ListDeploymentBuildsOutput$outboundSchema)),
  fingerprint: z.nullable(z.string()).optional(),
  copiedFrom: z.string().optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Builds$ {
  /** @deprecated use `Builds$inboundSchema` instead. */
  export const inboundSchema = Builds$inboundSchema;
  /** @deprecated use `Builds$outboundSchema` instead. */
  export const outboundSchema = Builds$outboundSchema;
  /** @deprecated use `Builds$Outbound` instead. */
  export type Outbound = Builds$Outbound;
}

/** @internal */
export const ListDeploymentBuildsResponseBody$inboundSchema: z.ZodType<
  ListDeploymentBuildsResponseBody,
  z.ZodTypeDef,
  unknown
> = z.object({
  builds: z.array(z.lazy(() => Builds$inboundSchema)),
});

/** @internal */
export type ListDeploymentBuildsResponseBody$Outbound = {
  builds: Array<Builds$Outbound>;
};

/** @internal */
export const ListDeploymentBuildsResponseBody$outboundSchema: z.ZodType<
  ListDeploymentBuildsResponseBody$Outbound,
  z.ZodTypeDef,
  ListDeploymentBuildsResponseBody
> = z.object({
  builds: z.array(z.lazy(() => Builds$outboundSchema)),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ListDeploymentBuildsResponseBody$ {
  /** @deprecated use `ListDeploymentBuildsResponseBody$inboundSchema` instead. */
  export const inboundSchema = ListDeploymentBuildsResponseBody$inboundSchema;
  /** @deprecated use `ListDeploymentBuildsResponseBody$outboundSchema` instead. */
  export const outboundSchema = ListDeploymentBuildsResponseBody$outboundSchema;
  /** @deprecated use `ListDeploymentBuildsResponseBody$Outbound` instead. */
  export type Outbound = ListDeploymentBuildsResponseBody$Outbound;
}
