import React from 'react';
import Logo from '../../Components/Shared/Logo';
import Banner from './Banner';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Impact from './Impact';
import GetInvolved from './GetInvolved';
import LatestResolved from './LatestResolved';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            {/* latest resolved section */}
            <LatestResolved></LatestResolved>
            <Features></Features>
            <HowItWorks></HowItWorks>
            <Impact></Impact>
            <GetInvolved></GetInvolved>
        </div>
    );
};

export default Home;