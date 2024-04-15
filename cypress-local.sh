token=$(vtex local token)
account=$(vtex local account)
workspace=$(vtex local workspace)

resolvedConfig="resolved-cypress.json"

sed -e "s/<danielvelasco>/\$workspace/" -e "s/<itgloberspartnercl>/\$account/" cypress.json > $resolvedConfig

export CYPRESS_authToken=$token

cmd=$1

shift

yarn cypress $cmd -C $resolvedConfig "$@" --browser chrome

rm $resolvedConfig
