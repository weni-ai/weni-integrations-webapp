#!/usr/bin/env sh

FILES=""
CURRENT_TIME=$( date +%s )
EXPIRE_TIME=$(( CURRENT_TIME-(30*24*60*60) ))
#EXPIRE_TIME=$(( CURRENT_TIME-1 ))

dict_keys(){
	IFS="$( printf '\t' )"
	echo "$1" | while read -r KEY VALUE ; do
		echo "${KEY}"
	done
}

dict_values(){
	IFS="$( printf '\t' )"
	echo "$1" | while read -r KEY VALUE ; do
		echo "${VALUE}"
	done
}


dict_set(){
	has_key="false"
	IFS="$( printf '\t' )"

	while read -r KEY VALUE ; do
		if [ "${KEY}" = "$2" ] ; then
			printf '%s\t%s\n' "$2" "$3"
			has_key='true'
		else
			printf '%s\t%s\n' "${KEY}" "${VALUE}"
		fi
	done <<-EOFDICT
	$1
	EOFDICT
	if [ "${has_key}" = 'false' ] ; then
		printf '%s\t%s\n' "$2" "$3"
	fi
}

dict_get(){
	has_key="false"
	IFS="$( printf '\t' )"

	while read -r KEY VALUE ; do
		if [ "${KEY}" = "$2" ] ; then
			echo "${VALUE}"
			has_key='true'
			break
		fi
	done <<-EOFDICT
$1
EOFDICT

	if [ "${has_key}" = 'false' ] ; then
		echo "$3"
	fi
}

load_files(){
	while read -r file_ctime filename ; do
		if [ "${file_ctime}" -le "$( dict_get "${FILES}" "${filename}" "3199999999" )" ] ; then
			FILES=$( dict_set "${FILES}" "${filename}" "${file_ctime}" )
		fi
	done<<EOFDICT
$( cat "$@" )
EOFDICT

}

print_files(){
	dict_keys "${FILES}" | while read -r filename ; do
		if [ -r "${filename}" ] ; then
			printf '%s\t%s\n' "$( dict_get "${FILES}" "${filename}" )" "${filename}"
		fi
	done
}

delete_old_files(){
	for filename in $( dict_keys "${FILES}" ); do
		if [ "${EXPIRE_TIME}" -gt "$( dict_get "${FILES}" "${filename}" )" ] ; then
			echo "deleting: ${filename} $( dict_get "${FILES}" "${filename}" )" 1>&2
			rm -rf "${filename}"
		fi
	done
}

generate_files(){
	while read -r filename ; do
		if [ -r "${filename}" ] ; then
			printf '%s\t%s\n' "${CURRENT_TIME}" "${filename}"
		fi
	done
}

if [ "$1" = "delete_old" ]; then
	shift
	load_files "$@"
	delete_old_files
elif [ "$1" = "print" ] ; then
	shift
	load_files "$@"
	#echo "$FILES"
	print_files
elif [ "$1" = "generate" ] ; then
	generate_files
elif [ "$1" = "css" ] ; then
	load_files <<EOFDICT
$( find . -iname "*.css" | generate_files ; [ -r assets/all.txt ] && cat assets/all.txt )
EOFDICT
	delete_old_files
	print_files > assets/all.txt
fi
