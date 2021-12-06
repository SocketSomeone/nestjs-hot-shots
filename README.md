# NestJS Hot-shots ![npm](https://img.shields.io/npm/v/nestjs-hot-shots) ![LICENSE](https://img.shields.io/npm/l/nestjs-hot-shots) ![Downloads](https://img.shields.io/npm/dm/nestjs-hot-shots) ![Last Commit](https://img.shields.io/github/last-commit/SocketSomeone/nestjs-hot-shots)

<img align="right" width="95" height="148" title="NestJS logotype" src="https://nestjs.com/img/logo-small.svg"  alt='Nest.JS logo'/>

Hot-shots Module for Nest.js Framework. A Node.js client for [Etsy](http://etsy.com)'s [StatsD](https://github.com/statsd/statsd) server, Datadog's [DogStatsD](https://docs.datadoghq.com/developers/dogstatsd/?tab=hostagent) server, and [InfluxDB's](https://github.com/influxdata/telegraf) Telegraf
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

See the [hot-shots](https://www.npmjs.com/package/hot-shots) module for more details.

## Stay in touch

* Author - [Alexey Filippov](https://t.me/socketsomeone)
* Twitter - [@SocketSomeone](https://twitter.com/SocketSomeone)

## License

[MIT](https://github.com/SocketSomeone/nestjs-hot-shots/blob/master/LICENSE) © [Alexey Filippov](https://github.com/SocketSomeone)
