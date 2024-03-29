import executeQuery from "@/helpers/dbcon";
import {NextResponse} from "next/server";

export async function GET(req, { params }){
    const id = params.id;

    const result = await executeQuery(
        {
            query: `
            SELECT
                Tracks.*,
                GROUP_CONCAT(Genres.GenreName) AS GenreList
            FROM
                Tracks
            LEFT JOIN
                TrackGenres ON Tracks.TrackID = TrackGenres.TrackID
            LEFT JOIN
                Genres ON TrackGenres.GenreID = Genres.GenreID
            WHERE
                Tracks.ArtistID = ${id}
            GROUP BY
                Tracks.TrackID`
        })

    const tracksWithGenresArray = result.map(track => {
        return {
            ...track,
            GenreList: track.GenreList ? track.GenreList.split(',') : [],
        };
    });

    return NextResponse.json(tracksWithGenresArray)
}