# NestJS Hot-shots ![npm](https://img.shields.io/npm/v/nestjs-hot-shots) ![LICENSE](https://img.shields.io/npm/l/nestjs-hot-shots) ![Downloads](https://img.shields.io/npm/dm/nestjs-hot-shots) ![Last Commit](https://img.shields.io/github/last-commit/SocketSomeone/nestjs-hot-shots)

<img align="right" width="95" height="148" title="NestJS logotype" src="https://nestjs.com/img/logo-small.svg"  alt='Nest.JS logo'/>

Hot-shots Module for Nest.js Framework. A Node.js client for [Etsy](http://etsy.com)'s [StatsD](https://github.com/statsd/statsd) server,
Datadog's [DogStatsD](https://docs.datadoghq.com/developers/dogstatsd/?tab=hostagent) server,
and [InfluxDB's](https://github.com/influxdata/telegraf) Telegraf
StatsD server.

**Features**

- TypeScript types
- Telegraf support
- Events
- Child clients
- TCP/UDS Protocol support
- Raw Stream Protocol support
- Mock mode
- Much more, including many bug fixes

For questions and support please use
the [Issues](https://github.com/SocketSomeone/nestjs-hot-shots/issues/new?assignees=&labels=question&template=question.yml).

## Installation

```bash
$ npm i nestjs-hot-shots hot-shots
$ yarn add nestjs-hot-shots hot-shots
$ pnpm add nestjs-hot-shots hot-shots
```

## Usage

Once the installation process is complete, we can import the `HotShotsModule` into the root `AppModule`:

```typescript
import { Module } from '@nestjs/common'
import { HotShotsModule } from 'nestjs-hot-shots';

@Module({
    imports: [
        HotShotsModule.forRoot({
            port: 8020,
            globalTags: { env: process.env.NODE_ENV }
        })
    ]
})
export class AppModule {
}
```

Then inject `StatsD` provider for use `hot-shots`:

```typescript
import { Injectable } from '@nestjs/common';
import { StatsD } from 'hot-shots';

@Injectable()
export class AppMetrics {
    public constructor(private readonly metrics: StatsD) {
    }

    public metricStuff() {
        this.metrics.increment('somecounter');
    }
}
```

### Metrics

You can use the `MetricsService` for metrics collection. It`s factory for creating metrics. It provides a set of methods to create different
types of metrics, such as counters, gauges, and histograms.

```typescript
import { Controller, Post } from '@nestjs/common';
import { MetricsService } from 'nestjs-hot-shots';
import { StatsD } from 'hot-shots';

@Controller
export class BooksController {
    private readonly booksAdded = this.metricsService.getCounter('books.added.count');

    public constructor(private readonly metricsService: MetricsService) {
    }

    @Post()
    public async addBook() {
        // some logic
        this.booksAdded.add();
    }
}
```

| Method                           | Description                                            |
|----------------------------------|--------------------------------------------------------|
| `getCounter(name: string)`       | Returns a counter metric with the given name.          |
| `getGauge(name: string)`         | Returns a gauge metric with the given name.            |
| `getHistogram(name: string)`     | Returns a histogram metric with the given name.        |
| `getTimer(name: string)`         | Returns a timer metric with the given name.            |
| `getUpDownCounter(name: string)` | Returns an up-down counter metric with the given name. |

### HTTP Metrics via Middleware

You can use the `HttpMetricsMiddleware` to collect HTTP metrics. It will automatically collect metrics for all incoming requests and
outgoing responses.

```typescript
import { Module } from '@nestjs/common';
import { HotShotsModule } from 'nestjs-hot-shots';
import { HttpMetricsMiddleware } from 'nestjs-hot-shots';

@Module({
    imports: [
        HotShotsModule.forRoot({
            ...
        })
    ]
})
export class AppModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(HttpMetricsMiddleware)
            .forRoutes('*');
    }
}
```

| Metric                               | Description                                     | Type      |
|--------------------------------------|-------------------------------------------------|-----------|
| `http_server_request_count`          | Total number of requests received by the server | Counter   |
| `http_server_response_count`         | Total number of responses sent by the server    | Counter   |
| `http_server_duration`               | Total time taken to process requests            | Histogram |
| `http_server_request_size`           | Size of incoming bytes.                         | Histogram |
| `http_server_response_size`          | Size of outgoing bytes.                         | Histogram |
| `http_server_response_success_count` | Total number of all successful responses.       | Counter   |
| `http_server_response_error_count`   | Total number of server error responses.         | Counter   |
| `http_client_request_error_count`    | Total number of client error requests.          | Counter   |
| `http_server_abort_count`            | Total number of aborted requests                | Counter   |

> Inspired by [nestjs-otel](https://github.com/pragmaticivan/nestjs-otel)

See the [hot-shots](https://www.npmjs.com/package/hot-shots) module for more details.

## Stay in touch

* Author - [Alexey Filippov](https://t.me/socketsomeone)
* Twitter - [@SocketSomeone](https://twitter.com/SocketSomeone)

## License

[MIT](https://github.com/SocketSomeone/nestjs-hot-shots/blob/master/LICENSE) © [Alexey Filippov](https://github.com/SocketSomeone)
