# SnykCon2020 Demo
This repository contains a simple application to demonstrate `docker scan` new command in SnykCon as part of Snyk and Docker partnership.
We will see how to scan container images directly from Docker Desktop, and extract the information we need recieved from Snyk to triage issues.

The flow of the demo will focus on:
* Running the new `docker scan <image-name>` command to get image vulnerabilities
* Adding `--file path/to/dockerfile` to the above command to get base image recommendations from Snyk
* Looking into the data fix issues
* See how you can sing-up to Snyk through Docker Desktop, get x2 scans and continue securing your containers

## Use `docker scan`
With the new command, you can get early visibility into vulnerabilities within the Docker interface. 
The scan, powered by Snyk, provides you with:
* Developer-suitable tool to scan container images for security issues before they land in production
* Doesn’t only provide a list of security issues, but also how to fix them
* Eliminates the need of prior deep knowledge in security


```console
$ docker scan alpine
...
✗ High severity vulnerability found in openssl/libcrypto1.1
  Description: NULL Pointer Dereference
  Info: https://snyk.io/vuln/SNYK-ALPINE310-OPENSSL-587954
  Introduced through: openssl/libcrypto1.1@1.1.1d-r0, openssl/libssl1.1@1.1.1d-r0, 
...
Tested 14 dependencies for known issues, found 2 issues.
```

## Use `--file` to get base image recommendations

One of the most powerful features of Snyk Container is the ability to recommend a more secure base image.
Snyk will pick up the base image used in the Dockerfile and suggested to update it in case less vulnerable ones are available. All actions are done directly from Docker Desktop interface - so you can include that in your workflow, parse the output and take action as needed
In this particular example we are using an old and insecure Node image and the recommendations can drastically cut down
on the number and severity of vulnerabilities.

```console
$ docker scan node:10.8.0-jessie --file Dockerfile
...
Tested 117 dependencies for known issues, found 923 issues.
Base Image          Vulnerabilities  Severity
node:10.8.0-jessie  923              86 high, 258 medium, 579 low

Recommendations for base image upgrade:

Alternative image types:
Base Image           Vulnerabilities  Severity
node:buster-slim     51               1 high, 5 medium, 45 low
node:14-slim         70               6 high, 7 medium, 57 low
node:erbium-slim     71               6 high, 8 medium, 57 low

```


## Explore the data

You can have the output in a JSON format and manipulate it with some simple jq commands.
Some examples:
* Get all vulnerabilities with "High" severity:
```cat scan-results.json| jq '. | (.vulnerabilities[] | select(.severity=="high"))'```
* Severity "High", but ignore base image vulns:
```docker scan <image> --exclude-base | jq <same as above>```
* "High" severity + mature exploit:
```cat scan-results.json |  jq '. | (.vulnerabilities[] | select(.exploit | contains("Functional")) | select(.severity=="high"))'```
* "High" + fixable, group by Dockerfile line:
```docker scan blog -f Dockerfile --exclude-base --json | jq '[.vulnerabilities[] | select(.nearestFixedInVersion) | select(.severity == "high") |  {packageName, dockerfileInstruction, title, severity, version, nearestFixedInVersion}]'```

## Sign-up for Snyk through Docker Desktop

If you enjoy scanning container images through Docker, you can signup for Snyk by running `docker scan --login` and get 200 free scans per month.


![Signup to Snyk through Docker](assets/docker-login.png)