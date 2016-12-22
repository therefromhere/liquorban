# Auckland Liquor Ban Areas

## Development

## Deployment

Quick + dirty deploy to s3:

	aws s3 sync . s3://liquorbanvis --exclude ".git/*" --exclude ".*"

