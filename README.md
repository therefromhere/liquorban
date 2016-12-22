# Auckland Liquor Ban Areas

A visualisation of Auckland Liquor Ban areas.

## Source Data

[Auckland Alcohol Control Area](http://aucklandopendata.aucklandcouncil.opendata.arcgis.com/datasets/20c82f3d1ddb4f95a77ceeb04126aea2_0)

## Development


## Deployment

Quick + dirty deploy to s3:

	aws s3 sync . s3://liquorbanvis --exclude ".git/*" --exclude ".*"

