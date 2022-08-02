import React from 'react'
import { Grid } from '@material-ui/core';
import { CloudDone, Public } from '@material-ui/icons';
import { AiFillAlert } from "react-icons/ai";

const StatusHeader = ({ props }) => {
    function getTotalProbes() {
        let totalProbes = 0;
        try {
            for (let region of props.regions) {
                totalProbes += region.probes.length;
            }
        }
        catch (e) {

        }
        return totalProbes;
    }
    function getTotalRegions() {
        return props.regions ? props.regions.length : 0;
    }
    const renderItem = (title,data) => {
             
         return (
            <div className={'dx-card-new responsive-paddings'}>
            <Grid container justifyContent="space-around" alignItems="center" spacing={1} style={{ margin: '-1em 0 -1em 0' }}>
                <Grid item xs={8}>
                    <p className='title-font' style={{ paddingTop: '0.75em' }}>{title}</p>
                    <p className='title-font' style={{ paddingBottom: '0.75em' }}><strong>{data}</strong></p>
                </Grid>
                <Grid item xs={4}>
                    {[1].map(obj => {
                        switch (title) {
                            case 'REGIONS':
                                return <Public key={1} style={{ color: '#606060', fontSize: '35' }} />;
                            case 'TOTAL PROBES':
                                return <AiFillAlert key={1} style={{ color: '#606060', fontSize: '35' }} />;
                            case 'TOTAL TESTS':
                                return <CloudDone key={1} fontSize='large' style={{ color: '#606060', fontSize: '35' }} />;
                            default:
                                return null;
                        }
                    })}
                </Grid>
            </Grid>
        </div>
          );
      };

    return (
        
        <Grid container justifyContent="center" alignItems="center" spacing={3}>
           
            <Grid item xs={12} sm={6} md={4}>
                {/* <StatItem title='REGIONS' stat={data.regions ? data.regions.length : 0} /> */}
                {renderItem('REGIONS', getTotalRegions())}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                {/* <StatItem title='TOTAL PROBES' stat={getTotalProbes()} /> */}
                {renderItem('TOTAL PROBES',getTotalProbes())}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                {renderItem('TOTAL TESTS',0)}
            </Grid>
        </Grid>
    )
}

export default StatusHeader